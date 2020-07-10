import React, { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import styled, { createGlobalStyle } from 'styled-components'
import {
  Box,
  DataTable,
  Grommet,
  Text,
  Heading,
  Avatar,
  Calendar,
  DropButton,
  Select,
} from 'grommet'
import { format } from 'timeago.js'
import Chart from 'react-apexcharts'

const GlobalStyle = createGlobalStyle`
  body {
    font: 11px Ubuntu, sans-serif;
    background: #fff8f8;
  }
`

const Wrapper = styled(Box)`
  width: 1750px;
  max-width: none;
  margin: 0 auto;
`

const Title = styled(Text)`
  font-weight: bold;
  font-size: 40px;
  line-height: 1.5em;
  text-align: center;
  margin-bottom: 1em;
`

const Article = styled(Box)`
  > a {
    font-size: 11px;
  }

  > span {
    color: gray;
    overflow: hidden;
    opacity: 0;
    font-size: 12px;
    transition: opacity 0.1s linear;
  }

  :hover {
    > span {
      opacity: 1;
    }
  }
`

const ValueChange = styled(Box)`
  color: ${(props) => (props.minor ? null : props.positive ? 'green' : 'red')};
  flex-direction: row;

  > span {
    margin-right: 4px;
  }
`

const App = () => {
  const [pair, setPair] = useState('btcusdt')
  const [datestamp, setDatestamp] = useState(moment().format('YYYY-MM-DD'))
  const [data, setData] = useState([])
  const [filter, setFilter] = useState([])

  const fetchData = useCallback(async () => {
    const body = new FormData()
    body.append('date', datestamp)

    return await fetch(
      'https://trendingnews.executium.com/api/v2/public/trending-news-data',
      { mode: 'cors', method: 'POST', body }
    )
      .then((res) => res.json())
      .then((res) =>
        res?.data
          ?.map(
            ({
              price_impact_120s,
              price_impact_300s,
              price_impact_600s,
              price_impact_900s,
              price_impact_1200s,
              price_impact_1800s,
              tone,
              ...item
            }) => ({
              ...item,
              date: item.date.time_published * 1000,
              effect: parseFloat(
                item.price_impact_3600s.data?.[pair]?.difference ?? 0
              ),
            })
          )
          .sort((a, b) => b.date - a.date)
      )
  }, [pair, datestamp])

  const minor = useMemo(() => {
    const effects = data.map((item) => item.effect)
    return (Math.max(...effects) + Math.min(...effects) * -1) / 100
  }, [data])

  // Fetches the data on mount
  useEffect(() => {
    let ignore = false
    fetchData().then((data) => (!ignore ? setData(data || []) : null))
    return () => {
      ignore = true
    }
  }, [fetchData])

  return (
    <Grommet
      theme={{
        text: { medium: { size: '11px' } },
        heading: {
          level: { 1: { medium: { size: '20px', height: '1em' } } },
        },
        button: {
          hover: { border: { width: '2px' } },
          border: { width: '1px' },
        },
        global: { font: { family: 'Ubuntu' } },
      }}
    >
      <GlobalStyle />
      <Wrapper>
        <Title>Executium Analytics Trends</Title>

        <Box direction={'row'} justify={'around'} align={'center'} fill>
          <Chart
            options={{
              chart: {
                id: 'change_over_time',
                fontFamily: 'Ubuntu, sans-serif',
                events: {
                  zoomed: (_, { xaxis: { min, max } }) => setFilter([min, max]),
                  scrolled: (_, { xaxis: { min, max } }) =>
                    setFilter([min, max]),
                },
              },
              title: {
                text: `Change in ${pair.toUpperCase()} over time`,
                align: 'left',
              },
              dataLabels: { enabled: false },
              yaxis: { title: { text: 'Change' } },
              xaxis: { type: 'datetime', title: { text: 'Time' } },
              tooltip: { x: { format: 'yyyy-MM-dd HH:mm' } },
              stroke: { curve: 'smooth' },
              fill: {
                type: 'gradient',
                gradient: {
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 0.5,
                  opacityTo: 0,
                  stops: [0, 90, 100],
                },
              },
            }}
            series={[
              {
                name: pair.toUpperCase(),
                data: data
                  .filter(
                    (item) => item.price_impact_3600s.status === 'completed'
                  )
                  .map((item) => [item.date, item.effect])
                  .reverse(),
              },
            ]}
            type={'area'}
            width={500}
            height={320}
          />

          <Box align={'center'}>
            <Text style={{ fontWeight: 'bold' }}>Pairing:</Text>
            <Select
              options={[
                'adabtc',
                'adausdt',
                'btcusdt',
                'ethbtc',
                'ethusdt',
                'xrpbtc',
                'xrpusdt',
              ]}
              value={pair}
              onChange={({ option }) => setPair(option)}
            />
            <br />
            <Text style={{ fontWeight: 'bold' }}>Date:</Text>
            <DropButton
              label={datestamp}
              size={'large'}
              dropContent={
                <Calendar
                  bounds={['2000-01-01', moment().format('YYYY-MM-DD')]}
                  onSelect={(date) => setDatestamp(date.substring(0, 10))}
                  date={datestamp}
                  size={'small'}
                />
              }
            />
          </Box>
        </Box>

        <DataTable
          columns={[
            {
              property: 'date',
              header: <Heading>Time</Heading>,
              render: (datum) => (
                <Text title={new Date(datum.date)}>{format(datum.date)}</Text>
              ),
            },
            {
              property: 'source',
              search: true,
              header: <Heading>Publisher</Heading>,
              render: (datum) => (
                <Box direction={'row'} align={'center'}>
                  <Avatar
                    src={'https://' + datum.domain + '/favicon.ico'}
                    size={'small'}
                    margin={'xsmall'}
                  />
                  <Text>{datum.source}</Text>
                </Box>
              ),
            },
            {
              property: 'title',
              search: true,
              header: <Heading>Article</Heading>,
              render: (datum) => (
                <Article>
                  <a href={datum.url}>{datum.title}</a>
                  <span>{datum.brief}</span>
                </Article>
              ),
            },
            {
              property: 'keywords',
              search: true,
              header: <Heading>Keywords</Heading>,
            },
            {
              property: 'effect',
              header: <Heading>Effect</Heading>,
              render: (datum) => {
                const trim = (str) => str?.replace(/[0.]+$/, '')
                const data = datum.price_impact_3600s.data[pair] ?? {}

                const isDone = datum.price_impact_3600s.status === 'completed'
                const positive = !data.difference?.startsWith('-')
                const isMinor = data.difference?.replace('-', '') < minor
                const title = `Changed from: ${trim(data.before)} to: ${trim(
                  data.after
                )}`

                return isDone ? (
                  <ValueChange
                    positive={positive}
                    minor={isMinor}
                    title={title}
                  >
                    <span className={'material-icons'}>
                      {isMinor
                        ? 'trending_flat'
                        : positive
                        ? 'trending_up'
                        : 'trending_down'}
                    </span>
                    {trim(data.difference)}
                  </ValueChange>
                ) : (
                  'Not compiled yet'
                )
              },
            },
          ]}
          primaryKey={'id'}
          data={data.filter(
            (item) =>
              !filter[0] || (item.date > filter[0] && item.date < filter[1])
          )}
          sortable
          resizeable
        />
      </Wrapper>
    </Grommet>
  )
}

export default App
