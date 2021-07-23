import * as k8s from '@kubernetes/client-node';
import YAML from 'yaml'
import jsonconvert from 'json2yaml'



export async function createPod(podName, containerName, image) {  
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const client = k8s.KubernetesObjectApi.makeApiClient(kc);

  let data = {
    "apiVersion": "v1",
    "kind": "Pod",
    "metadata": {
      "name": "my-pod"
    },
    "spec": {
      "containers": [
        {
          "name": "add-item-app",
          "image": "us-west1-docker.pkg.dev/karam-testing/add-item-app/add-item-app:v1",
          "volumeMounts": [
            {
              "mountPath": "/mnt/fileserver",
              "name": "mypvc"
            }
          ]
        }
      ],
      "volumes": [
        {
          "name": "mypvc",
          "persistentVolumeClaim": {
            "claimName": "fileserver1-claim",
            "readOnly": false
          }
        }
      ]
    }
  };
  
  let yamlString = jsonconvert.stringify(data);
  let spec = YAML.parse(yamlString);  

  const created = [];
  try {
		await client.read(spec)
		const response = await client.patch(spec);
		created.push(response.body);
		
	} catch {
		const response = await client.create(spec);
		created.push(response.body);
	}
};



export async function createVolume(volumeName, path, serverIp) {  
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const client = k8s.KubernetesObjectApi.makeApiClient(kc);

  let data = {
    "apiVersion": "v1",
    "kind": "PersistentVolume",
    "metadata": {
      "name": volumeName
    },
    "spec": {
      "capacity": {
        "storage": "1T"
      },
      "accessModes": [
        "ReadWriteMany"
      ],
      "nfs": {
        "path": path,
        "server": serverIp
      }
    }
  };
  
  let yamlString = jsonconvert.stringify(data);
  let spec = YAML.parse(yamlString);  

  const created = [];
  try {
		await client.read(spec)
		const response = await client.patch(spec);
		created.push(response.body);
		
	} catch {
		const response = await client.create(spec);
		created.push(response.body);
	}
};


export async function createStorageClaim(claimName, volumeName) {  
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const client = k8s.KubernetesObjectApi.makeApiClient(kc);

  let data = {
    "apiVersion": "v1",
    "kind": "PersistentVolumeClaim",
    "metadata": {
      "name": claimName
    },
    "spec": {
      "accessModes": [
        "ReadWriteMany"
      ],
      "storageClassName": "",
      "volumeName": volumeName,
      "resources": {
        "requests": {
          "storage": "1T"
        }
      }
    }
  };
  
  let yamlString = jsonconvert.stringify(data);
  let spec = YAML.parse(yamlString);  

  const created = [];
  try {
		await client.read(spec)
		const response = await client.patch(spec);
		created.push(response.body);
		
	} catch {
		const response = await client.create(spec);
		created.push(response.body);
	}
};




let targetVolumeName = "fileserver1"
let targetPath = "/vol1"
let targetServerIp = "10.210.89.170"
createVolume(targetVolumeName, targetPath, targetServerIp);


let targetClaimName = "fileserver-claim";
let targetPersistentVolume = "fileserver1"
createStorageClaim(targetClaimName, targetPersistentVolume);


let targetPodName = "my-pod";
let targetContainerName = "add-item-app";
let targetImage = "docker.io/karamkhanna/add_item_app:latest"
createPod(targetPodName, targetContainerName, targetImage);
