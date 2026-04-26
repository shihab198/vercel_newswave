export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return formatDate(dateStr);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getCategoryColor = (cat) => {
  const colors = {
    Technology: '#2563eb',
    Politics: '#7c3aed',
    Sports: '#16a34a',
    Business: '#d97706',
    Health: '#dc2626',
    Entertainment: '#ec4899',
    Science: '#0891b2',
    World: '#c9410a',
    Other: '#6b7280',
  };
  return colors[cat] || '#6b7280';
};

export const CATEGORIES = ['All', 'Technology', 'Politics', 'Sports', 'Business', 'Health', 'Entertainment', 'Science', 'World', 'Other'];

export const truncate = (str, len = 150) => {
  if (!str) return '';
  const plain = str.replace(/<[^>]*>/g, '');
  return plain.length > len ? plain.slice(0, len) + '...' : plain;
};

export const getPlaceholderImage = (category) => {
  const imgs = {
    Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    Politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80',
    Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
    Business: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    Health: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80',
    Entertainment: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=600&q=80',
    Science: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80',
    World: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
  };
  return imgs[category] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80';
};