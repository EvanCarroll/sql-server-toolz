import fs from 'fs';
import sql from 'mssql';
import rp from 'request-promise-native';
import url from 'url';

const MSDOCS = 'https://docs.microsoft.com';
const RELDOC = '/en-us/sql/relational-databases';
const HTTP_METHOD = 'HEAD';

const fnToUrl = x => x.replace(/_/g,'-');

const makeDocSF = func => url.format({
	host: MSDOCS,
	pathname: ((func)=>`${RELDOC}/system-functions/sys-${func}-transact-sql`)(fnToUrl(func))
});

const makeDocDMV = func => url.format({
	host: MSDOCS,
	pathname: ((func)=>`${RELDOC}/system-dynamic-management-views/sys-${func}-transact-sql`)(fnToUrl(func))
});

const q = fs.readFileSync('./sql/get_all_sysobject_if.sql', 'utf8');

console.log(`
Running Query
-------------
${q.replace(/^/gm, "\t")}
`);

(async () => {
	try {
		const pool = await sql.connect({
			user:'sa',
			password:process.env.SQLCMDPASSWORD,
			server:'localhost'
		});
		const req = await pool.request().query(q);
		for ( const proc of req.recordset ) {
			try {
				if ( proc.name.match(/^dm/) ) {
					const res = await rp({
						method: HTTP_METHOD,
						url: makeDocDMV(proc.name)
					});
				}
				else {
					const res = await rp({
						method: HTTP_METHOD,
						url: makeDocSF(proc.name)
					});
				}
			}
			catch (err) {
				console.log(`[${err.statusCode}] Prospect ${proc.name}`);
			}
		}
		pool.close();
	} catch (err) {
		console.log('ERROR: ' + err);
	}
})()
