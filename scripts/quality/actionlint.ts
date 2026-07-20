import { containerImages } from '../security/config';
import { assertDocker, hostUser, projectRoot, run } from '../security/shared';

await assertDocker();
await run('docker', [
	'run',
	'--rm',
	'--read-only',
	'--network=none',
	'--cap-drop=ALL',
	'--security-opt=no-new-privileges',
	'--user',
	hostUser(),
	'--volume',
	`${projectRoot}:/repo:ro`,
	'--workdir=/repo',
	containerImages.actionlint,
	'-color=false'
]);
