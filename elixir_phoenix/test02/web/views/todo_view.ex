defmodule Test02.TodoView do
  use Test02.Web, :view

  def render("index.json", %{todos: todos}) do
    %{data: render_many(todos, Test02.TodoView, "todo.json")}
  end

  def render("show.json", %{todo: todo}) do
    %{data: render_one(todo, Test02.TodoView, "todo.json")}
  end

  def render("todo.json", %{todo: todo}) do
    %{id: todo.id,
      description: todo.description,
      complete: todo.complete}
  end
end
