import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'

import { REPORT_CREATE_ROUTE, REPORT_EDIT_ROUTE } from '../../constants'
import { Report } from '../../types'
import { apiCheckPermission, doApiRequest } from '../../utils'
import { OBJECT_NAME_TITLE_SINGULAR, SITE_NAME } from '../../utils/branding'
import { Contact, Icon, Metadata, Text } from '../common'
import AuthPrompt from '../common/AuthPrompt'
import { downloadReport } from '../reports/ReportPage'
import ReportTable from '../reports/ReportTable'

type ReportsProps = {
  reports: Report[]
}

const ReportsTab = ({
  reports: initialReports,
}: ReportsProps): ReactElement => {
  const [reports, setReports] = useState<Report[]>(initialReports ?? [])
  const permission = apiCheckPermission('clubs.generate_reports')

  const router = useRouter()

  const reloadReports = (): void => {
    doApiRequest('/reports/?format=json')
      .then((resp) => (resp.ok ? resp.json() : []))
      .then((data) => setReports(data))
  }

  if (!permission) {
    return <Text>You do not have permission to view this page.</Text>
  }

  return (
    <>
      <Link href={REPORT_CREATE_ROUTE}>
        <a className="button is-link">
          <Icon name="plus" alt="plus" /> Create New Report
        </a>
      </Link>
      <ReportTable
        onRun={downloadReport}
        onEdit={(report: Report) =>
          router.push(REPORT_EDIT_ROUTE(), REPORT_EDIT_ROUTE(report.id))
        }
        onDelete={(report: Report) => {
          doApiRequest(`/reports/${report.id}/?format=json`, {
            method: 'DELETE',
          }).then(reloadReports)
        }}
        reports={reports}
      />
    </>
  )
}

export default ReportsTab
