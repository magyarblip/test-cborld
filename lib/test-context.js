import { JsonLdDocumentLoader } from 'jsonld-document-loader';

export const CONTEXT_URL = 'https://example.com/my-context/v1';
export const CONTEXT = {
    '@context': {
        ex: 'https://example.com/my-context#',
        type: '@type',
        Example: 'ex:Example',
        label: 'ex:label',
        content: 'ex:content'
    }
};

export const ALT_CONTEXT_URL = 'https://example.com/my-context/v2';
export const ALT_CONTEXT = {
    '@context': {
        ex: 'https://example.com/my-context#',
        type2: '@type',
        Example2: 'ex:Example',
        label2: 'ex:label',
        content2: 'ex:content'
    }
};

// This is identical to CONTEXT, but substitutes content with ucontent
export const BOGUS_CONTEXT = {
    '@context': {
        ex: 'https://example.com/my-context#',
        type: '@type',
        Example: 'ex:Example',
        label: 'ex:label',
        ucontent: 'ex:content'
    }
};

export function loadContext(ctx_url, ctx) {
    const loader = new JsonLdDocumentLoader();
    loader.addStatic(ctx_url, ctx)
    return loader.build();
}
