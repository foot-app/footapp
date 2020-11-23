import React, { Component } from 'react'

export default class Grid extends Component {

    toCssClasses(numbers, attribute) {
        const values = numbers ? numbers.split(' ') : []
        let classes = ''

        if (values[0]) classes += ` ${attribute}-${values[0]}`
        if (values[1]) classes += ` ${attribute}-sm-${values[1]}`
        if (values[2]) classes += ` ${attribute}-md-${values[2]}`
        if (values[3]) classes += ` ${attribute}-lg-${values[3]}`

        return classes
    }

    generateTextCenter(textCenter) {
        if (textCenter) return ' text-center'
        else return ''
    }

    generateClassName(className) {
        if (className) return ` ${className}`
        else return ''
    }

    render() {
        const gridClasses = this.toCssClasses(this.props.cols || '12', 'col')
        const gridOffset = this.toCssClasses(this.props.offset || '', 'offset')
        const textCenter = this.generateTextCenter(this.props.textCenter)
        const className = this.generateClassName(this.props.className)
        return (
            <div className={gridClasses + gridOffset + textCenter + className}>
                {this.props.children}
            </div>
        )
    }
}