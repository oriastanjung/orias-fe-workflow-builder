import React from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "@/contexts/AuthContext"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    // Hold internal states
    const [isLoading, setIsLoading] = React.useState<boolean>(true)

    // Get data from parent context
    const { user } = useAuth()

    const navigate = useNavigate()

    React.useEffect(() => {
        if (user) {
            if (!user.roles.some(role => role.name === 'Admin')) {
                navigate('/app')
            }

            setIsLoading(false)
        }
    }, [user])

    return isLoading ? null : children
}

export default AdminLayout