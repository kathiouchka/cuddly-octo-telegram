/**
 * Utilitaires pour la validation et le nettoyage des entrées utilisateur
 */

// Fonction pour nettoyer les entrées utilisateur
export function sanitizeInput(input: string): string {
  // Supprimer les balises HTML
  let sanitized = input.replace(/<[^>]*>?/gm, '');
  
  // Limiter la longueur
  sanitized = sanitized.substring(0, 1000);
  
  // Supprimer les caractères de contrôle
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  return sanitized.trim();
}

// Fonction pour valider les URLs
export function validateUrl(url: string, type: 'youtube' | 'twitter' | 'image' = 'image'): boolean {
  try {
    const urlObj = new URL(url);
    
    // Vérifier que c'est une URL valide avec un protocole http ou https
    if (!urlObj.protocol || !['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Validation spécifique selon le type
    if (type === 'youtube') {
      return url.includes('youtube.com/') || url.includes('youtu.be/');
    } else if (type === 'twitter') {
      return url.includes('twitter.com/') || url.includes('x.com/');
    }
    
    return true;
  } catch (e) {
    return false;
  }
} 