SELECT
	o.id,
	cls.name AS [schema],
	o.name,
	trim(o.type) AS type,
	QUOTENAME(cls.name) +'.'+ QUOTENAME(o.name+'$') AS secretDollarIdent,
	object_id( QUOTENAME('msdb') +'.'+ QUOTENAME(cls.name) +'.'+ QUOTENAME(o.name+'$') ) AS secretDollarObjId,
	n.name AS type_desc
FROM msdb.sys.sysschobjs$ AS o
LEFT OUTER JOIN msdb.sys.syspalnames AS n
	ON n.value = o.type
	AND n.class = 'OBTY'
LEFT OUTER JOIN msdb.sys.sysclsobjs AS cls
	ON o.nsid = cls.id
	AND cls.class = 50;
--LEFT OUTER JOIN sys.syssingleobjrefs AS r
--	ON r.depid = cls.id
--	AND r.class = 50
--'UT', 'IT', 'S', 'U', 'V' ;
