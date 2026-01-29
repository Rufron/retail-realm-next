import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

interface OrderListProps {
    orders: any[] // Using any for simplicity here, but should be typed properly with Prisma types
}

export function OrderList({ orders }: OrderListProps) {
    if (orders.length === 0) {
        return <div className="text-center py-4">No orders found.</div>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.slice(-8)}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {item.product?.name ?? "Product"}
                                        </span>{" "}
                                        &times; {item.quantity}
                                    </div>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">{formatPrice(Number(order.total))}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
