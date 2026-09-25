#!/bin/bash
# The official mysql image auto-grants ALL PRIVILEGES on $MYSQL_DATABASE
# to $MYSQL_USER as part of its own startup (before any script here
# runs). This app never needs to CREATE/ALTER/DROP/DELETE its own
# tables at runtime, so we claw that back down to exactly what the
# route handler uses: SELECT, INSERT, UPDATE.
#
# NOTE: docker-entrypoint-initdb.d executes .sh files by *sourcing*
# them into the entrypoint's own shell, not as an isolated subprocess.
# `set -e`/`set -u` here would leak into the rest of the entrypoint
# script and can crash it after we return — so this deliberately does
# not set any shell options, and checks the mysql exit code itself.

mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<-SQL
	REVOKE ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* FROM '${MYSQL_USER}'@'%';
	GRANT SELECT, INSERT, UPDATE ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
	FLUSH PRIVILEGES;
SQL
