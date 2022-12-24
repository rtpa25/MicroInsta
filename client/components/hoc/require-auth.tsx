import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export function requireAuth(gssp: GetServerSideProps) {
    return async (ctx: GetServerSidePropsContext) => {
        if (
            (ctx.resolvedUrl === '/auth/signin' ||
                ctx.resolvedUrl === '/auth/signup') &&
            ctx.req?.headers.cookie?.startsWith('session')
        ) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        if (!ctx.req?.headers.cookie?.startsWith('session')) {
            return {
                redirect: {
                    destination: '/auth/signin',
                    permanent: false,
                },
            };
        }

        return await gssp(ctx);
    };
}
