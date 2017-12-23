import fs from 'fs';
import sql from 'mssql';
import rp from 'request-promise-native';
import {makeDocSF, makeDocVDM} from '../lib/DocGenerate';
import {sqlDollarObjExists} from '../lib/SecretDollar';

const HTTP_METHOD = 'HEAD';

const q = fs.readFileSync('./sql/get_all_sysobject.sql', 'utf8');

if ( process.env.SQLCMDPASSWORD == undefined ) {
	console.error( 'Can not run without env SQLCMDPASSWORD set to sa password');
	process.exit();
}

console.log(`
Running Query
-------------
${q.replace(/^/gm, "\t")}
`);

(async () => {
	try {
		const pool = await sql.connect({
			user:'sa',
			port: 1434,
			password:process.env.SQLCMDPASSWORD,
			database:'mssqlsystemresource',
			server:'localhost',
			max: { max: 1 }
		});
		const req = await pool.request().query(q);

		let secretDollarObjects = [];
		for ( const obj of req.recordset ) {
			//console.log( obj.name, obj.secretDollar );
			const sql = sqlDollarObjExists(obj.secretDollarIdent);
			console.log(sql);
			try {
				const res = await pool.request().query(sql);
				secretDollarObjects.push(obj);
			}
			catch (err) {
				if (err.code != 'EREQUEST') { console.log(err) }
			}
			// try {
			// 	if ( proc.name.match(/^dm/) ) {
			// 		const res = await rp({
			// 			method: HTTP_METHOD,
			// 			url: makeDocDMV(proc.name)
			// 		});
			// 	}
			// 	else {
			// 		const res = await rp({
			// 			method: HTTP_METHOD,
			// 			url: makeDocSF(proc.name)
			// 		});
			// 	}
			// }

			//catch (err) {
			//	console.log(`[${err.statusCode}] Prospect ${proc.name}`);
			//}
		}
		secretDollarObjects.forEach(x =>
			console.log(
				'[%s-%s] used to detect %s %s',
				String(x.type).padEnd(2),
				String(x.id).padStart(11),
				String(x.secretDollarObjId).padEnd(15),
				x.secretDollarIdent,
			)
		);
		console.log ( '\tGot %d hits', secretDollarObjects.length );
		pool.close();
	} catch (err) {
		console.log('ERROR: ' + err);
	}
})()
