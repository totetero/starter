defmodule Test02.Player do
  use Test02.Web, :model

  schema "players" do
    field :name, :string
    field :type, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :type])
    |> validate_required([:name, :type])
  end
end
