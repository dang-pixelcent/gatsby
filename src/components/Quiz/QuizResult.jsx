// src/components/Quiz/QuizResult.js
import React from 'react';
import { motion } from 'framer-motion';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { graphql, useStaticQuery, Link } from 'gatsby'; // Import navigate của Gatsby

const QuizResult = ({ finalPageData }) => {
    const data = useStaticQuery(graphql`
            query {
                logoImage: file(relativePath: { eq: "logo/logo-foot.png" }) {
                    childImageSharp {
                        gatsbyImageData(
                            width: 250
                            placeholder: BLURRED
                            formats: [AUTO, WEBP]
                            quality: 90
                        )
                    }
                }
            }
        `);

    const logo = getImage(data.logoImage);
    return (
        <motion.div
            className={`form-body`}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* <h1 className="text-4xl md:text-5xl text-neutral font-medium whitespace-pre-line">
                {finalPageData.headline}
            </h1>
            <p className="text-lg text-neutral-faded mt-4 max-w-xl">
                {finalPageData.message}
            </p>
            <button className="button-root rounded-full capitalize gap-s hover:bg-primary-highlighted bg-primary text-onprimary shadow-raised text-center px-l py-[calc(1em*0.9)] mt-8">
                {finalPageData.ctaButton}

            </button> */}
            <header className="flex-v-c text-neutral border-b-2 border-b-neutral-faded">
                <Link to="/">
                    <GatsbyImage
                        imgStyle={{ transition: 'none' }}
                        decoding="async"
                        loading="eager"
                        fadeIn={false}
                        objectFit='contain'
                        image={logo}
                        alt="Wellness Clinic Marketing"
                        className="w-auto h-2xl my-xs"
                    />
                </Link>
            </header>
            <main>
                <section className="pt-4xl px-page">
                    <div className="container !max-w-[var(--container-result)] items-center justify-center">
                        <div className="column">
                            <h1 className="text-xl text-center text-form font-Soleto-XBold">{finalPageData.headline}</h1>
                            <p className="text-center whitespace-pre-line text-form">{finalPageData.message}</p>
                        </div>
                        <a className="inline text-underlined hover:decoration-transparent mt-[10px]" href="/weight-loss/results">
                            <button className="button-root rounded-full capitalize gap-s hover:bg-primary-highlighted bg-primary text-form shadow-raised w-full text-center px-l py-[calc(1em*0.9)] md:max-w-[400px]">
                                {finalPageData.ctabutton}
                                <div className="inline-c-c flex-shrink-0 absolute bottom-0 w-full left-0">
                                    <span role="progressbar" aria-label="action is loading" className="animate-glowing-border" style={{ '--loader-size': 'var(--size-l)', '--loader-stroke': 'calc(var(--size-l)*0.25)' }}>
                                    </span>
                                </div>
                            </button>
                        </a>
                    </div>
                </section>
            </main>
        </motion.div>
    );
};

export default QuizResult;