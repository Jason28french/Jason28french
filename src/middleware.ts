import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt';

export function middleware(request: NextRequest) {
  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ['/login', '/register'];
  
  // Vérifier si la route actuelle est publique
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Récupérer le token depuis le localStorage (via le header Authorization)
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // Rediriger vers la page de connexion si pas de token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

    // Vérifier les permissions selon le rôle
    if (request.nextUrl.pathname.startsWith('/broadcast') && decoded.role !== 'broadcaster') {
      return NextResponse.redirect(new URL('/watch', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/watch') && !['viewer', 'broadcaster'].includes(decoded.role)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Token invalide ou expiré
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/broadcast/:path*', '/watch/:path*'],
}; 