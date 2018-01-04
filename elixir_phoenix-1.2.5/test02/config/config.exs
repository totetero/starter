# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :test02,
  ecto_repos: [Test02.Repo]

# Configures the endpoint
config :test02, Test02.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "CBJybIi2yFzU6xkyZTFKcU+TFgLZv3Yt7cSoTV9B+9PecAt9RFun7l/Mxfhn86Oz",
  render_errors: [view: Test02.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Test02.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
