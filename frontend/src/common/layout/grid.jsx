import React, { Component } from 'react'

export default class Grid extends Component {

    toCssClasses(numbers) {
        const cols = numbers ? numbers.split(' ') : []
        let classes = ''

        if (cols[0]) classes += `col-${cols[0]}`
        if (cols[1]) classes += ` col-sm-${cols[1]}`
        if (cols[2]) classes += ` col-md-${cols[2]}`
        if (cols[3]) classes += ` col-lg-${cols[3]}`

        return classes
    }

    generateOffset(numbers) {
        const cols = numbers ? numbers.split(' ') : []
        let classes = ''

        if (cols[0]) classes += ` offset-${cols[0]}`
        if (cols[1]) classes += ` offset-sm-${cols[1]}`
        if (cols[2]) classes += ` offset-md-${cols[2]}`
        if (cols[3]) classes += ` offset-lg-${cols[3]}`

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
        const gridClasses = this.toCssClasses(this.props.cols || '12')
        const gridOffset = this.generateOffset(this.props.offset || '')
        const textCenter = this.generateTextCenter(this.props.textCenter)
        const className = this.generateClassName(this.props.className)
        return (
            <div className={gridClasses + gridOffset + textCenter + className}>
                {this.props.children}
            </div>
        )
    }
}