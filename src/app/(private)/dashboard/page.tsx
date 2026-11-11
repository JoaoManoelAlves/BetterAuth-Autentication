import { logout } from "@/components/actions/auth/logout"
import { Button } from "@/components/ui/button"

export default function DashBoardPage() {
    return(
        <>
            <form action={logout}>
                <Button type="submit" variant="destructive">Logout</Button>
            </form>
            <h1>DashBoard Page</h1>
        </>
    )
}