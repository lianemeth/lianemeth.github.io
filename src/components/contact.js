/**
 * Simple Contact page
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { rhythm, scale } from "../utils/typography"

const Contact = () => {
    const data = useStaticQuery(graphql`
    query ContactQuery {
        site {
        siteMetadata {
                social {
                    twitter
                    linkedin
                    github
                    bandcamp
                }
            }
        }
    }
    `)
    const social = data.site.siteMetadata.social
    return (
        <>
        <h4>Contact</h4>
        <ul
        style={{
            ...scale(0.1),
            listStyleType: "none",
            marginBottom: rhythm(0.2),
            marginTop: 0
        }}
        >
            <li>
                <a href={social.twitter}>twitter</a>
            </li>
            <li>
                <a href={social.linkedin}>linkedin</a>
            </li>
            <li>
                <a href={social.github}>github</a>
            </li>
            <li>
                <a href={social.bandcamp}>bandcamp</a>
            </li>
        </ul>
        </>
    )
}

export default Contact
