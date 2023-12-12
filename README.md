## Installation

1. Go to ` ./backend``, follow the instruction within  `backend/README.md`to start the backend server.
1b. Optional: If you are running this project on your local machine, you can use`ngrok`to expose the server to the internet. This steps ensured that the`/webhook` callback by RunPod API is forwarded to your local machine.
2. Go to `./frontend, follow the instruction within `frontend/README.md` to start the frontend server.

# Tech stacks

1. Frontend: Next.js, React, TypeScript, TailwindCSS, ShadCN UI, RadixUI, Socket.io-client.
2. Backend: Node.js with Express.js, TypeScript, Socket.io, Ngrok (Optional), RunPod API.
3. Database: Browser's local storage- only accessible by the Frontend (for now).

## Known Issues

- The images only exist on Cloudflare for a short amount of time (24 hours). Afterward, they will die.
- There are 2 socket connections triggered each time client connects to the server. Potential fix: creating a React Hooks called useSocket to avoid duplicated connections.
- The backend doesn't support multi-tenants within the socket part on the server.
