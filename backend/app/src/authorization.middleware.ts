import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { isUndefined } from "lodash";

interface RBAC {
    resource: string,
    role: string[]
}

const users = [
    {
      id: 1,
      username: 'user1',
      password: 'password1',
      tenant: 'tenant1'
    },
    {
      id: 2,
      username: 'user2',
      password: 'password2',
      tenant: 'tenant2'
    },
];

export class AuthorizationMiddleware {

    private static readonly ACCESS_TOKEN_SECRET = "e52a50f84a4f67f62ad9325160050f8cbb7f4effc80bc9a6e37e723f25498ab870bd7d41fa3530a42a1be2836a5857c7f0bb55261c60b7ae4290cc38605ac44f";

    private static readonly RBAC: Array<RBAC> = [
        {
            resource: "maintenance-object",
            role: ["maintainer", "reporter"]
        },
        {
            resource: "maintenance-object",
            role: ["reporter"]
        }
    ]

    public static authenticate(username:string, password:string) {
        const user = users.find((u) => u.username === username && u.password === password);

        if (!user) {
          return null;
        }
        
            // Create a JWT token with the user's ID and sign it with the secret key
        const token = jwt.sign({ userId: user.id, tenant: user.tenant }, AuthorizationMiddleware.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        return token;
    }

    // private static readonly ROLES:

    public static authenticateToken(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        console.log("auth header "+authHeader)

        // Check if the header exists and starts with 'Bearer '
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Access denied. Invalid or missing Bearer token.' });
        }
        const token = authHeader.substring('Bearer '.length);

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, AuthorizationMiddleware.ACCESS_TOKEN_SECRET, (err, payload:any) => {
            console.log(err)
            if (err) {
                return res.sendStatus(403);
            }

            res.locals.jwtPayload = payload;

            next();
        })
    }

    public static authorize(req: Request, res: Response, next: NextFunction) {

        const jwtPayload = res.locals.jwtPayload;

        const route = req.path;

        const roles = jwtPayload.roles as Array<string>;

        const rule = AuthorizationMiddleware.RBAC.find(rule => rule.resource === route);

        const tenant = jwtPayload.tenant;

        console.log("tenant "+tenant)

        res.locals.tenant = tenant

        
        if(isUndefined(tenant)) {
            return res.sendStatus(403).json({ message: 'No Tenant ID provided.'});
        }

        next();
    }
}