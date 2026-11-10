import {
  BedDouble,
  Camera,
  Compass,
  Coffee,
  Heart,
  Landmark,
  Leaf,
  MapPin,
  Mountain,
  Plane,
  Route,
  Sailboat,
  Sparkles,
  Sun,
  Sunrise,
  Users,
  Utensils,
  Waves,
} from "lucide-react"

const icons = {
  bed: BedDouble,
  boat: Sailboat,
  camera: Camera,
  compass: Compass,
  coffee: Coffee,
  heart: Heart,
  landmark: Landmark,
  leaf: Leaf,
  map: MapPin,
  mountain: Mountain,
  plane: Plane,
  route: Route,
  sparkles: Sparkles,
  sun: Sun,
  sunrise: Sunrise,
  users: Users,
  utensils: Utensils,
  waves: Waves,
}

export default function DynamicIcon({ name, ...props }) {
  const Icon = icons[name] || Compass
  return <Icon aria-hidden="true" {...props} />
}
