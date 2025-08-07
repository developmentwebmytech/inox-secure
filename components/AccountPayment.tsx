// "use client"

// import { useState, useEffect } from "react"
// import { useSession } from "next-auth/react"
// import { Plus, Edit, Trash2, CreditCard } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

// interface PaymentMethod {
//   _id: string
//   type: string
//   last4: string
//   expiryMonth: string
//   expiryYear: string
//   brand: string
// }

// export function AccountPayment() {
//   const { data: session } = useSession()
//   const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Mock data for payment methods
//     setPaymentMethods([
//       {
//         _id: "1",
//         type: "credit",
//         last4: "1234",
//         expiryMonth: "12",
//         expiryYear: "26",
//         brand: "visa",
//       },
//       {
//         _id: "2",
//         type: "debit",
//         last4: "5678",
//         expiryMonth: "08",
//         expiryYear: "27",
//         brand: "mastercard",
//       },
//     ])
//     setLoading(false)
//   }, [session])

//   const getBrandColor = (brand: string) => {
//     switch (brand) {
//       case "visa":
//         return "bg-blue-600"
//       case "mastercard":
//         return "bg-red-600"
//       default:
//         return "bg-gray-600"
//     }
//   }

//   if (loading) {
//     return <div>Loading payment methods...</div>
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">Payment Methods</h2>
//           <p className="text-gray-600">Manage your payment options</p>
//         </div>
//         <Button className="bg-[#0042adef] hover:bg-[#0042ad] gap-2">
//           <Plus className="h-4 w-4" />
//           Add Card
//         </Button>
//       </div>

//       {paymentMethods.length === 0 ? (
//         <Card>
//           <CardContent className="p-8 text-center">
//             <p className="text-gray-500">No payment methods saved</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-4">
//           {paymentMethods.map((method) => (
//             <Card key={method._id}>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className={`p-3 rounded-lg ${getBrandColor(method.brand)}`}>
//                       <CreditCard className="h-6 w-6 text-white" />
//                     </div>
//                     <div>
//                       <p className="font-medium">•••• •••• •••• {method.last4}</p>
//                       <p className="text-sm text-gray-600">
//                         Expires {method.expiryMonth}/{method.expiryYear}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex gap-2">
//                     <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//                       <Edit className="h-4 w-4" />
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
