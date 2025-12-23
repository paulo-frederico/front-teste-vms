import { useEffect, useMemo, useState } from 'react'
import { Building2, Loader2, MapPin, Search } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listSitesMock } from '@/modules/admin/sites/siteMocks'
import type { Site, SiteStatus } from '@/modules/admin/sites/siteTypes'
import { useAuth } from '@/contexts'
import { SystemRole } from '@/modules/shared/types/auth'

const statusLabel: Record<SiteStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
}

const statusBadge: Record<SiteStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  INACTIVE: 'bg-slate-100 text-slate-500 border border-slate-200',
}

export function SiteList() {
  const { user } = useAuth()
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | SiteStatus>('ALL')

  const isCentralAdmin = user?.role === SystemRole.ADMIN_MASTER || user?.role === SystemRole.ADMIN
  const tenantFilter = isCentralAdmin ? undefined : user?.tenantId

  useEffect(() => {
    let isMounted = true
    listSitesMock(tenantFilter ? { tenantId: tenantFilter } : undefined)
      .then((data) => {
        if (isMounted) {
          setSites(data)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [tenantFilter])

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const matchesSearch =
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.state?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'ALL' ? true : site.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [sites, searchTerm, statusFilter])

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Building2 className="h-5 w-5 text-brand-primary" /> Sites monitorados
        </CardTitle>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por nome, cidade ou estado"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'ALL' | SiteStatus)}>
            <SelectTrigger className="md:w-[220px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="ACTIVE">Ativos</SelectItem>
              <SelectItem value="INACTIVE">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Carregando sites...
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Nenhum site encontrado com os filtros atuais.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Site</th>
                  {isCentralAdmin ? <th className="px-4 py-3">Tenant</th> : null}
                  <th className="px-4 py-3">Cidade / Estado</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Câmeras</th>
                  <th className="px-4 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((site) => (
                  <tr key={site.id} className="border-b last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground">{site.name}</p>
                      {site.description ? <p className="text-xs text-muted-foreground">{site.description}</p> : null}
                    </td>
                    {isCentralAdmin ? (
                      <td className="px-4 py-4 text-sm text-muted-foreground">{site.tenantName}</td>
                    ) : null}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {site.city || '—'} / {site.state || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge[site.status]}`}>
                        {statusLabel[site.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-foreground">{site.camerasCount}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {new Date(site.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
