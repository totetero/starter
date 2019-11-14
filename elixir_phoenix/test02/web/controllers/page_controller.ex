defmodule Test02.PageController do
  use Test02.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def chat(conn, _params) do
    conn = put_layout conn, false
    render conn, "chat.html"
  end
end
