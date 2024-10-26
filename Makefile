export TURSO_DATABASE_URL ?= http://127.0.0.1:8080

.PHONY: help test dev db migrate studio

# Help
help: ## Show this help
	@printf "\033[36mAvailable commands:\033[0m\n"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36mmake %-20s\033[0m%s\n", $$1, $$2}'

# help: ## Show this help
# 	@printf "\033[36mhelp: \033[0m\n"
# 	@$(foreach make,$(MAKEFILE_LIST),$(call print_help_for,$(make));)
# 	@printf "\n"

test: ## Test front and back in containers
	yarn test

dev: ## Run local development server
	yarn dev

db: ## Run local development database (src/db/db.sql)
	turso dev --db-file src/db/db.sql

migrate: ## Run local development database (src/db/db.sql)
	yarn drizzle-kit migrate 

generate: ## Run local development database (src/db/db.sql)
	yarn drizzle-kit generate

studio: ## Run drizzle-kit studio
	yarn drizzle-kit studio
