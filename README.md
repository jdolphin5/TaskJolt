# TaskJolt
TaskJolt is a full-stack interactive Task Management web app.

**Frontend**: HTML, CSS, Typescript, ReactJS, NodeJS, Webpack

**Backend**: Typescript, NodeJS, ExpressJS, MySQL, Prisma

==========================================================================

To run TaskJolt using VSCode:

- Download and open the repo in VSCode
- Install Node 10.8.1
- Install mySQL
- Install Prisma
- Install dependencies using `npm install` in both /client/ and /server/ folders
- Create a .env file in /server/:
    DATABASE_URL=mysql://root:[mysql_root_password]@localhost:3306/taskjolt
    PORT=3000
- Create the database from the schema.prisma file with `npx prisma db push`
- `npm run build` -> `npm start` in the terminal from /server/, once the server is running, run the same commands from /client/ in another terminal 
