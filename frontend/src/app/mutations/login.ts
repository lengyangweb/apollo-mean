import { gql } from "apollo-angular";


export const LOGIN = gql`
    mutation (
        $username: String!
        $email: String!
        $password: String!
    ) {
        signIn (
            username: $username
            email: $email
            password: $password
        )
    }
`;