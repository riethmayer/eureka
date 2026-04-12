.PHONY: help test dev migrate generate studio push

# Help
help: ## Show this help
	@printf "\033[36mAvailable commands:\033[0m\n"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36mmake %-20s\033[0m%s\n", $$1, $$2}'

test: ## Run tests
	yarn test

dev: ## Run local development server
	yarn dev

migrate: ## Apply database migrations
	yarn drizzle-kit migrate

generate: ## Generate migration files from schema changes
	yarn drizzle-kit generate

push: ## Push schema directly to database (no migration files)
	yarn drizzle-kit push

studio: ## Run drizzle-kit studio
	yarn drizzle-kit studio
