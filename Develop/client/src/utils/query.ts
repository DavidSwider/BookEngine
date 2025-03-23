import {gql} from "@apollo/client";
export const QUERYME= gql`
{
    me{
        _id
        username
        savedBooks{
            bookId
            authors
            description
            title
            link
            image
        }
    }
}`