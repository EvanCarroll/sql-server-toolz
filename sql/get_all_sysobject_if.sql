SELECT name
FROM sys.sysobjects
WHERE type = 'IF' OR xtype = 'IF'
ORDER BY name;
