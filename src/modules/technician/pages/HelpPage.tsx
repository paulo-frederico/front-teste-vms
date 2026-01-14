/**
 * Página de Ajuda do Técnico
 * Documentação e suporte para técnicos
 */

import {
  HelpCircle,
  Book,
  Video,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  ExternalLink,
  ChevronRight,
  Wrench,
  Camera,
  Network,
  Shield,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const guiasRapidos = [
  {
    titulo: 'Como realizar diagnóstico de câmera',
    descricao: 'Passo a passo para identificar problemas de conectividade',
    icone: Wrench,
    link: '#',
  },
  {
    titulo: 'Configuração de rede para câmeras IP',
    descricao: 'Guia de configuração de VLAN, IP e portas',
    icone: Network,
    link: '#',
  },
  {
    titulo: 'Instalação física de câmeras',
    descricao: 'Procedimentos de instalação e cabeamento',
    icone: Camera,
    link: '#',
  },
  {
    titulo: 'Políticas de acesso temporário',
    descricao: 'Regras e responsabilidades do técnico',
    icone: Shield,
    link: '#',
  },
]

const faqItems = [
  {
    pergunta: 'Como solicitar acesso temporário a um cliente?',
    resposta: 'O acesso temporário deve ser solicitado ao cliente através do administrador da conta. O cliente pode conceder acesso pelo painel de controle, especificando quais câmeras você poderá acessar e por quanto tempo. Você será notificado quando o acesso for concedido.',
  },
  {
    pergunta: 'O que fazer quando uma câmera está offline?',
    resposta: 'Primeiro, verifique a conectividade de rede usando a ferramenta de diagnóstico. Verifique se o cabo de rede está conectado, se a porta do switch está funcionando e se há alimentação PoE. Se o problema persistir, pode ser necessário verificar fisicamente o equipamento.',
  },
  {
    pergunta: 'Como atualizar o firmware de uma câmera?',
    resposta: 'O firmware deve ser atualizado através da interface web da câmera. Acesse o IP da câmera, faça login com as credenciais administrativas, navegue até a seção de manutenção/sistema e faça o upload do arquivo de firmware. Importante: não desligue a câmera durante a atualização.',
  },
  {
    pergunta: 'Qual o procedimento para substituir uma câmera?',
    resposta: 'Ao substituir uma câmera, documente as configurações da câmera antiga (IP, máscara, gateway, streams). Instale a nova câmera fisicamente, configure com os mesmos parâmetros de rede e ajuste foco/posicionamento. Teste a gravação e visualização antes de finalizar.',
  },
  {
    pergunta: 'Como reportar um problema que não consigo resolver?',
    resposta: 'Use o sistema de tickets para escalar o problema. Inclua todas as informações relevantes: ID da câmera, cliente, testes já realizados, logs de erro e fotos se necessário. A equipe de suporte de segundo nível entrará em contato.',
  },
  {
    pergunta: 'Posso acessar gravações antigas das câmeras?',
    resposta: 'Não. O acesso do técnico é limitado à visualização ao vivo e configuração das câmeras. Gravações e playback são restritos aos administradores e usuários autorizados do cliente por questões de privacidade e LGPD.',
  },
]

export function HelpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-deep">Central de Ajuda</h1>
        <p className="text-muted-foreground">Documentação, guias e suporte para técnicos</p>
      </div>

      {/* Contato Rápido */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Suporte Telefônico</p>
                <p className="text-sm text-muted-foreground">0800 123 4567</p>
                <p className="text-xs text-muted-foreground">Seg-Sex, 8h às 18h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-muted">
                <Mail className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">E-mail</p>
                <p className="text-sm text-primary">suporte.tecnico@unifique.com</p>
                <p className="text-xs text-muted-foreground">Resposta em até 24h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-muted">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Chat Interno</p>
                <p className="text-sm text-muted-foreground">Disponível no app</p>
                <p className="text-xs text-muted-foreground">Resposta imediata</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guias Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Guias Rápidos
          </CardTitle>
          <CardDescription>
            Documentação técnica para procedimentos comuns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {guiasRapidos.map((guia, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <guia.icone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{guia.titulo}</p>
                  <p className="text-sm text-muted-foreground">{guia.descricao}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Perguntas Frequentes
          </CardTitle>
          <CardDescription>
            Respostas para as dúvidas mais comuns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.pergunta}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Recursos Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recursos Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-auto py-4 justify-start gap-3">
              <Video className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Vídeos de Treinamento</p>
                <p className="text-xs text-muted-foreground">Tutoriais em vídeo</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button variant="outline" className="h-auto py-4 justify-start gap-3">
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Manuais Técnicos</p>
                <p className="text-xs text-muted-foreground">PDFs de equipamentos</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button variant="outline" className="h-auto py-4 justify-start gap-3">
              <Book className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Base de Conhecimento</p>
                <p className="text-xs text-muted-foreground">Artigos e soluções</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
