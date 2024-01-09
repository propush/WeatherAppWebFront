import {QueryClient} from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 0.5,
            refetchInterval: 1000 * 60 * 1,
            refetchOnWindowFocus: true,
            retry: false,
        },
    },
});

export async function parseErrorReason(response: Response) {
    async function parseJsonResponse() {
        const json = await response.json() as { message: string | null | undefined };
        return json.message || response.json();
    }

    return response.statusText || await parseJsonResponse();
}
