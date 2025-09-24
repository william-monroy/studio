'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const teamMembers = [
  {
    name: "Armando Roman",
    role: "Plastic Processing Sales Engineer",
    avatar: "https://media.licdn.com/dms/image/v2/D4E03AQF90iyq9YsL1A/profile-displayphoto-crop_800_800/B4EZggFI2NGoAI-/0/1752884875729?e=1761782400&v=beta&t=0hmVtxVboRP6S1EVKhnswEQLyLESuVL3XGYCcxtUOOs",
    linkedin: "https://www.linkedin.com/in/armandoromandl",
    email: "armandoromandl@gmail.com"
  },
  {
    name: "Clarisa Pluma",
    role: "Biopharmaceutical Process Engineer",
    avatar: "https://i.postimg.cc/3JHTNjR4/Whats-App-Image-2025-09-24-at-15-09-35.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "A00845660@tec.mx"
  },
  {
    name: "Erika Rosado",
    role: "Senior Electromechanical Design Engineer",
    avatar: "https://media.licdn.com/dms/image/v2/C4E03AQFe-wrRSAe7VQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1547247872525?e=1761782400&v=beta&t=VhsQ2lXg0x5FR9rx8bVWip-Q0387LyCtonHjBFMpN9U",
    github: "https://github.com",
    linkedin: "https://www.linkedin.com/in/manuel-maldonado-094a21140/",
    email: "erika.rosado.t@gmail.com"
  },
  {
    name: "Manuel Maldonado",
    role: "Maintenance Project Engineer",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQGMObymgY9TOw/profile-displayphoto-shrink_800_800/B56ZUJ_f11HsAc-/0/1739629396421?e=1761782400&v=beta&t=-V5lBkfqf0qGe37uO-t-UMSUg17OBtf_1Tw0w7440VI",
    github: "https://github.com",
    linkedin: "https://www.linkedin.com/in/manuel-maldonado-094a21140/",
    email: "manuel.malad@gmail.com"
  },
  {
    name: "William Monroy",
    role: "Software Engineer",
    avatar: "https://github.com/william-monroy.png",
    github: "https://github.com/william-monroy",
    linkedin: "https://linkedin.com/in/william-monroy",
    email: "william@thebluebird.co"
  },
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
            Conoce al equipo detrás de DecisionVerse
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="w-full mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 w-full"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[300px]"
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
        </div>

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
