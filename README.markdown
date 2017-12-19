NAME
====

SQL Server Toolz

DESCRIPTION
====

A suite of good-enough tools for playing with SQL Server.

* `find_undocumented.mjs`: Find undocumented Microsoft functions in SQL Server.
	This function pulls down a superset of `type = IF` sysobjects and tests them against the
	docs.  Based on https://dba.stackexchange.com/q/193475/2639

As of 2017, these functions are suspect for being undocumented.

```
dm_db_database_page_allocations
dm_db_objects_disabled_on_compatibility_level_change
dm_db_stats_properties_internal
dm_logconsumer_cachebufferrefs
dm_logconsumer_privatecachebuffers
dm_logpool_consumers
dm_logpool_sharedcachebuffers
dm_logpoolmgr_freepools
dm_logpoolmgr_respoolsize
dm_logpoolmgr_stats
dm_os_enumerate_filesystem
dm_os_file_exists
fn_column_store_row_groups
fn_dblog
fn_dblog_xtp
fn_dump_dblog
fn_dump_dblog_xtp
fn_full_dblog
```


