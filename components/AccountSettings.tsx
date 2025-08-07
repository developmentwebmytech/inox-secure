"use client"

import { useState } from "react"
import { Shield, Bell, Download, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AccountSettings() {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotionalEmails: false,
    smsNotifications: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      {/* <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="order-updates">Order updates</Label>
            <Switch
              id="order-updates"
              checked={notifications.orderUpdates}
              onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="promotional-emails">Promotional emails</Label>
            <Switch
              id="promotional-emails"
              checked={notifications.promotionalEmails}
              onCheckedChange={(checked) => setNotifications({ ...notifications, promotionalEmails: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">SMS notifications</Label>
            <Switch
              id="sms-notifications"
              checked={notifications.smsNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card> */}

      {/* Security */}
      {/* <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Enable Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Account Data
          </Button>
        </CardContent>
      </Card> */}

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
