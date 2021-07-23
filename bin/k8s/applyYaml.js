import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import YAML from 'yaml'
import { promisify } from 'util';


export async function yamlApply(specPath) {
	const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const client = k8s.KubernetesObjectApi.makeApiClient(kc);
	

	const fsReadFileP = promisify(fs.readFile);
    const specString = await fsReadFileP(specPath, 'utf8');
    const spec = YAML.parse(specString);
	const created = [];
	
	try {
		await client.read(spec)
		const response = await client.patch(spec);
		created.push(response.body);
		
	} catch {
		const response = await client.create(spec);
		created.push(response.body);
	}

}

yamlApply('./bin/k8s/testNamespace.yaml')

// to see it  => kubectl get namespaces 
//to check the labels to test if patch worked => kubectl describe namespace test