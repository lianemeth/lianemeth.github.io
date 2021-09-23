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
                    twitch
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
        <h3
        style={{
            marginBottom: rhythm(1),
            marginTop: rhythm(1)
        }}
        >Contact Me</h3>
        <ul
        style={{
            listStyleType: "none",
            marginBottom: rhythm(1),
            marginTop: 0,
            paddingBottom: `${rhythm(1.5)} ${rhythm(1)}`,
        }}
        >
                <a href={social.twitch}>twitch</a> {"| "}
                <a href={social.twitter}>twitter</a> {"| "}
                <a href={social.linkedin}>linkedin</a> {"| "}
                <a href={social.github}>github</a> {"| "}
                <a href={social.bandcamp}>bandcamp</a> 
        </ul>
        </>
    )
}

export default Contact
