defmodule Test02.PageController do
  use Test02.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
