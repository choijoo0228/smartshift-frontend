SmartShift Frontend
Readme File

Project Name:
SmartShift Frontend

Overview:
SmartShift Frontend is a React-based web application that provides the user interface for the SmartShift roster management system. It enables managers to create and manage employee shifts, while employees can view their assigned schedules through a web interface.

The frontend communicates with a backend REST API deployed on Amazon EC2 and is hosted as a static website using Amazon S3.

--------------------------------------------------
1. REQUIRED SOFTWARE / DEPENDENCIES
--------------------------------------------------

Development Requirements:
- Node.js (version 20 recommended)
- npm (Node Package Manager)
- Git
- Web browser (Chrome, Edge, etc.)

Main Dependencies:
- axios (^1.13.6)
- react (^19.2.4)
- react-dom (^19.2.4)

DevDependencies:
- vite (^8.0.0)
- @vitejs/plugin-react (^6.0.0)
- eslint (^9.39.4)
- @eslint/js (^9.39.4)
- eslint-plugin-react-hooks (^7.0.1)
- eslint-plugin-react-refresh (^0.5.2)
- globals (^17.4.0)
- @types/react (^19.2.14)
- @types/react-dom (^19.2.3)

--------------------------------------------------
2. PROJECT STRUCTURE
--------------------------------------------------

smartshift-frontend
├── public
├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── assets
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── App.jsx
├── package.json
├── package-lock.json
├── vite.config.js

--------------------------------------------------
3. IMPORTANT CONFIGURATION FILES
--------------------------------------------------

1) package.json
- Defines project dependencies and scripts

2) vite.config.js
- Configures build settings
- base: './' ensures relative paths for S3 hosting

3) GitHub Actions workflow:
- .github/workflows/frontend-deploy.yml
- Automates build and deployment to Amazon S3

4) Environment configuration (optional):
- .env and .env.production file for API endpoint

Example:
VITE_API_URL=https://api.choijoo.dev
VITE_API_URL=http://localhost:8080

--------------------------------------------------
4. LOCAL DEVELOPMENT
--------------------------------------------------

Step 1:
Clone the repository

git clone https://github.com/choijoo0228/smartshift-frontend.git
cd smartshift-frontend

Step 2:
Install dependencies

npm ci

Step 3:
Run development server

npm run dev

Step 4:
Application runs at:

http://localhost:5173

--------------------------------------------------
5. BUILD FOR PRODUCTION
--------------------------------------------------

Build the application:

npm run build

Output directory:

dist/

Preview build locally (optional):

npm run preview

--------------------------------------------------
6. DEPLOYMENT (AMAZON S3)
--------------------------------------------------

Frontend is deployed using Amazon S3 static website hosting.

Deployment process:
1. Build the application (dist/)
2. Upload files to S3 bucket
3. Configure bucket for static hosting

Example command:

aws s3 sync dist/ s3://<your-bucket-name> --delete

Note:
The --delete flag removes old files from the bucket to keep deployment consistent.

--------------------------------------------------
7. DOMAIN AND HTTPS CONFIGURATION
--------------------------------------------------

Frontend URL:
https://choijoo.dev

Backend API:
https://api.choijoo.dev

Domain is configured using DNS (Namecheap).

HTTPS is enabled using:
- Application Load Balancer (ALB)
- AWS Certificate Manager (ACM)

Note:
Direct HTTPS for S3 typically requires CloudFront. Due to AWS Learner Lab restrictions, CloudFront could not be used, and an alternative setup using ALB and ACM was implemented.

--------------------------------------------------
8. CI/CD DEPLOYMENT
--------------------------------------------------

Frontend deployment is automated using GitHub Actions.

Workflow file:
.github/workflows/frontend-deploy.yml

Pipeline steps:
- Checkout repository
- Setup Node.js (version 20)
- Install dependencies (npm ci)
- Build application (npm run build)
- Configure AWS credentials
- Deploy to S3 using aws s3 sync

Required GitHub Secrets:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_SESSION_TOKEN (optional)
- AWS_REGION
- S3_BUCKET_NAME

--------------------------------------------------
9. LIMITATIONS
--------------------------------------------------

- AWS CloudFront could not be used due to IAM restrictions
- AWS Amplify was tested but not usable due to CloudFront dependency
- Manual DNS configuration was required
- Application depends on backend availability

--------------------------------------------------
10. BACKEND INTEGRATION
--------------------------------------------------

Frontend communicates with backend REST API:

https://api.choijoo.dev

API communication is handled using Axios.

Example endpoints:
- /api/auth/login
- /api/employees
- /api/shifts

--------------------------------------------------
11. FUTURE IMPROVEMENTS
--------------------------------------------------

- Improve UI/UX design
- Add responsive design for mobile devices
- Improve error handling and validation
- Add real-time updates
- Enhance user experience

--------------------------------------------------
12. AUTHOR
--------------------------------------------------

Choijoo Erdenesuren
Student ID: 25116380
National College of Ireland
MSc in Cloud Computing
