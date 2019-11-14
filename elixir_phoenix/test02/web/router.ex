defmodule Test02.Router do
  use Test02.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Test02 do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/chat", PageController, :chat
    resources "/players", PlayerController
  end

  scope "/api", Test02 do
    pipe_through :api

    resources "/todos", TodoController, except: [:new, :edit]
  end
end
