import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../../layout';
import PostItem from '../../Blog/PostItem';

// Hàm để gọi GraphQL API phía client
async function fetchSearchResults(searchTerm) {
    const response = await fetch("https://agencysitestaging.mystagingwebsite.com/graphql", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query SearchPosts($searchTerm: String!) {
                        posts(where: { search: $searchTerm }) {
                            nodes {
                                id
                                title
                                uri
                                excerpt(format: RENDERED)
                                featuredImage {
                                    node {
                                        sourceUrl
                                        altText
                                    }
                                }
                            }
                        }
                    }
            `,
            variables: { searchTerm },
        }),
    });

    const json = await response.json();
    console.log("Search results:", json);
    return json?.data?.posts?.nodes || [];
}


const SearchResultPage = ({ location }) => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Lấy từ khóa `q` từ URL
        const params = new URLSearchParams(location.search);
        const query = params.get('q') || '';
        setSearchTerm(query);       

        if (query) {
            setIsLoading(true);
            fetchSearchResults(query)
                .then(posts => {
                    setResults(posts);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Search failed:", error);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [location.search]);

    return (
        <Layout>
            <div className="cus-container" style={{ padding: '50px 0' }}>
                <h1>Search Results for: "{searchTerm}"</h1>

                {isLoading && <p>Loading results...</p>}

                {!isLoading && results.length === 0 && <p>No posts found matching your search.</p>}

                {!isLoading && results.length > 0 && (
                    <div className="blog-items ast-flex flex-column">
                        {results.map(post => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SearchResultPage;