
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

package main

import (
	"log"
	"net/http"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/gorilla/websocket"
)

func main() {
	go GoroutineWebsocket()

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Static("/", "public")
	e.GET("/hello", HandleHello)
	e.GET("/ws", HandleWebsocket)
	e.Start(":8080")
}

func HandleHello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World")
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

type Client struct {
	conn *websocket.Conn
}

type Message struct {
	Message string `json:message`
}

var clients = make(map[*Client]bool)
var broadcast = make(chan Message)
var upgrader = websocket.Upgrader{}

func GoroutineWebsocket() {
	for {
		message := <-broadcast
		for client := range clients {
			err := client.conn.WriteJSON(message)
			if err != nil {
				log.Printf("error occurred while writing message: %v", err)
				client.conn.Close()
				delete(clients, client)
			}
		}
	}
}

func HandleWebsocket(c echo.Context) error {
	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil { return err }
	defer conn.Close()

	client := &Client{ conn: conn }
	clients[client] = true

	for {
		var message Message
		err := client.conn.ReadJSON(&message)
		if err != nil {
			log.Printf("error occurred while reading message: %v", err)
			delete(clients, client)
			break;
		}
		broadcast <- message
	}

	return nil
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

