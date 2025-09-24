'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const teamMembers = [
  {
    name: "William Monroy",
    role: "Software Developer",
    avatar: "https://github.com/william-monroy.png",
    github: "https://github.com/william-monroy",
    linkedin: "https://linkedin.com/in/william-monroy",
    email: "william@thebluebird.co"
  },
  {
    name: "Carlos Rodríguez",
    role: "Backend Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "carlos@decisionverse.com"
  },
  {
    name: "María López",
    role: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "maria@decisionverse.com"
  },
  {
    name: "David Chen",
    role: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "david@decisionverse.com"
  },
  {
    name: "Sofia Martínez",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "sofia@decisionverse.com"
  },
  {
    name: "Alex Johnson",
    role: "DevOps Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "alex@decisionverse.com"
  }
];

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4">
            Créditos
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            Conoce al increíble equipo detrás de DecisionVerse
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-headline font-semibold text-primary mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {member.role}
                    </p>
                  </div>
                  
                  <div className="flex justify-center space-x-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={member.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`mailto:${member.email}`}>
                        <Mail className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-headline font-semibold text-primary mb-4">
              ¡Gracias por jugar DecisionVerse!
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Este juego fue creado con pasión y dedicación por nuestro equipo. 
              Esperamos que disfrutes tomando decisiones y aprendiendo de las consecuencias.
            </p>
          </div>
          
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Volver al Juego
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
