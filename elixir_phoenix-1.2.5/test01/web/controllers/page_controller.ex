defmodule Test01.PageController do
  use Test01.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
