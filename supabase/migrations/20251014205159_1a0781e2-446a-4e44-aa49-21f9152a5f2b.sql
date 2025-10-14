-- Add RLS policy for admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON business_subscriptions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policy for admins to manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions"
ON business_subscriptions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));