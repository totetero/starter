defmodule Test02.Repo.Migrations.CreatePlayer do
  use Ecto.Migration

  def change do
    create table(:players) do
      add :name, :string
      add :type, :string

      timestamps()
    end

  end
end
