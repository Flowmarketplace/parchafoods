-- Add RLS policies for admins to manage events
CREATE POLICY "Admins can manage all events"
ON events
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));