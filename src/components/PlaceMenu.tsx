import { Card, CardContent } from '@/components/ui/card';
import { MenuItem } from '@/types/place';

interface PlaceMenuProps {
  menu: MenuItem[];
}

const PlaceMenu = ({ menu }: PlaceMenuProps) => {
  // Group menu items by category
  const groupedMenu = menu.reduce((acc, item) => {
    const category = item.category || 'Otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedMenu).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xl font-bold mb-4 text-primary">{category}</h3>
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">{item.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaceMenu;
