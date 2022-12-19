import { Router, Request, Response } from 'express';

const router = Router();

router.post('/api/users/signout', async (req: Request, res: Response) => {
    try {
        req.session = null; // This fires a clear cookie event to the browser.
        res.send({ message: 'OK' });
    } catch (error) {
        console.error(error);
        res.send({ message: 'Error' });
    }
});

export { router as signoutRouter };
