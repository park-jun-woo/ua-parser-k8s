# ua-parser-k8s

## Overview
**ua-parser-k8s** is a Kubernetes-native microservice for parsing User-Agent strings. It utilizes [`ua-parser-js`](https://github.com/faisalman/ua-parser-js) to extract browser, OS, and device information from HTTP User-Agent headers.

## Installation
To deploy **ua-parser-k8s** on a Kubernetes cluster using Helm, run the following commands:

```sh
helm repo add parkjunwoo https://www.parkjunwoo.com/charts
helm repo update
helm install uaparser parkjunwoo/ua-parser-k8s --set redis.password=YOUR_PASSWORD
```

### Helm Chart Parameters
- **`redis.password=YOUR_PASSWORD`**: Sets the Redis authentication password.

## Usage
To use **ua-parser-k8s**, send a `POST` request to the service with the User-Agent string in the request body.

### **Request**
```http
POST http://uaparser/
Content-Type: application/json

{
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
```

### **Response**
```json
{
  "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "browser": {
    "name": "Chrome",
    "version": "120.0.0.0",
    "major": "120"
  },
  "engine": {
    "name": "WebKit",
    "version": "537.36"
  },
  "os": {
    "name": "Windows",
    "version": "10"
  },
  "device": {
    "vendor": "Unknown",
    "model": "Unknown",
    "type": "desktop"
  },
  "cpu": {
    "architecture": "amd64"
  }
}
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Dependencies
This project uses [`ua-parser-js`](https://github.com/faisalman/ua-parser-js) to analyze User-Agent strings.

### `ua-parser-js` License
`ua-parser-js` is an open-source JavaScript library developed by [Faisal Salman](https://github.com/faisalman) and is licensed under the [AGPL-3.0 License](https://github.com/faisalman/ua-parser-js/blob/master/LICENSE.md).
