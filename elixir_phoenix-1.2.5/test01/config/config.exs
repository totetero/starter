# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :test01,
  ecto_repos: [Test01.Repo]

# Configures the endpoint
config :test01, Test01.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "wOAZ3eoH+GVB7qK7js9TnJjYbqGHLaSAzpdEL0PMTBI9HdxbvlYGorl1nrOsgHG6",
  render_errors: [view: Test01.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Test01.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
